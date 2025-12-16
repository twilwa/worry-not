// ABOUTME: PixiJS canvas component for game rendering
// ABOUTME: Renders hex grid with territory state visualization and click detection

import { useEffect, useRef, useCallback } from "react";
import { Application, Graphics, Text, TextStyle, Container } from "pixi.js";
import type { Territory } from "@end-of-line/shared";
import {
  get3x3GridCoords,
  coordToId,
  axialToPixel,
  pixelToAxial,
} from "@end-of-line/shared";
import { useGameStore } from "../store/index.js";

export type GameCanvasProps = {
  width?: number;
  height?: number;
  onTerritoryClick?: (territoryId: string) => void;
};

const HEX_SIZE = 60;
const CORP_COLOR = 0x0066ff;
const RUNNER_COLOR = 0xff3366;
const NEUTRAL_COLOR = 0x666666;
const SELECTED_COLOR = 0x00ff88;

export function GameCanvas({
  width = 800,
  height = 600,
  onTerritoryClick,
}: GameCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const hexContainerRef = useRef<Container | null>(null);

  const territories = useGameStore((s) => s.territories);
  const selectedTerritoryId = useGameStore((s) => s.gameId); // Reuse for now

  // Calculate grid offset to center the hex grid
  const gridOffsetX = width / 2 - HEX_SIZE * 1.5;
  const gridOffsetY = height / 2 - HEX_SIZE * 1.2;

  const handleClick = useCallback(
    (x: number, y: number) => {
      const coord = pixelToAxial({ x, y }, HEX_SIZE, gridOffsetX, gridOffsetY);

      // Check if coord is within our 3x3 grid
      if (coord.q >= 0 && coord.q <= 2 && coord.r >= 0 && coord.r <= 2) {
        const territoryId = coordToId(coord);
        onTerritoryClick?.(territoryId);
      }
    },
    [gridOffsetX, gridOffsetY, onTerritoryClick],
  );

  // Initialize PixiJS
  useEffect(() => {
    if (!containerRef.current) return;

    const initPixi = async () => {
      const app = new Application();
      await app.init({
        width,
        height,
        backgroundColor: 0x0a0a0f,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
      });

      appRef.current = app;
      containerRef.current?.appendChild(app.canvas as HTMLCanvasElement);

      // Title
      const titleStyle = new TextStyle({
        fontFamily: "monospace",
        fontSize: 20,
        fill: 0x00ff88,
      });
      const title = new Text({ text: "END OF LINE", style: titleStyle });
      title.x = width / 2 - title.width / 2;
      title.y = 15;
      app.stage.addChild(title);

      // Hex grid container
      const hexContainer = new Container();
      hexContainer.eventMode = "static";
      hexContainer.cursor = "pointer";
      hexContainerRef.current = hexContainer;
      app.stage.addChild(hexContainer);

      // Click handler
      hexContainer.on("pointerdown", (event) => {
        handleClick(event.globalX, event.globalY);
      });
    };

    initPixi();

    return () => {
      if (appRef.current) {
        appRef.current.destroy(true);
        appRef.current = null;
        hexContainerRef.current = null;
      }
    };
  }, [width, height, handleClick]);

  // Update hex grid when territories change
  useEffect(() => {
    const hexContainer = hexContainerRef.current;
    if (!hexContainer) return;

    // Clear existing hexes
    hexContainer.removeChildren();

    // Get coordinates and draw each hex
    const coords = get3x3GridCoords();

    for (const coord of coords) {
      const territoryId = coordToId(coord);
      const territory = territories.find((t) => t.id === territoryId);

      const { x, y } = axialToPixel(coord, HEX_SIZE, gridOffsetX, gridOffsetY);

      const hex = new Graphics();
      const isSelected = selectedTerritoryId === territoryId;

      // Draw filled hex
      drawFilledHexagon(hex, x, y, HEX_SIZE * 0.9, territory, isSelected);
      hexContainer.addChild(hex);

      // Add territory label
      if (territory) {
        const labelStyle = new TextStyle({
          fontFamily: "monospace",
          fontSize: 10,
          fill: 0xffffff,
        });
        const label = new Text({
          text: `${territory.corporateInfluence}%`,
          style: labelStyle,
        });
        label.x = x - label.width / 2;
        label.y = y - 5;
        hexContainer.addChild(label);

        // Territory type indicator
        const typeStyle = new TextStyle({
          fontFamily: "monospace",
          fontSize: 8,
          fill: 0xaaaaaa,
        });
        const typeLabel = new Text({
          text: territory.type.substring(0, 3),
          style: typeStyle,
        });
        typeLabel.x = x - typeLabel.width / 2;
        typeLabel.y = y + 10;
        hexContainer.addChild(typeLabel);
      }
    }
  }, [territories, selectedTerritoryId, gridOffsetX, gridOffsetY]);

  return (
    <div
      ref={containerRef}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
}

function drawFilledHexagon(
  graphics: Graphics,
  centerX: number,
  centerY: number,
  radius: number,
  territory: Territory | undefined,
  isSelected: boolean,
): void {
  // Calculate fill color based on corporate influence
  let fillColor = NEUTRAL_COLOR;
  if (territory) {
    const influence = territory.corporateInfluence;
    if (influence >= 60) {
      // Corp-controlled: interpolate from neutral to blue
      const t = (influence - 60) / 40;
      fillColor = lerpColor(NEUTRAL_COLOR, CORP_COLOR, t);
    } else if (influence <= 40) {
      // Runner-controlled: interpolate from neutral to red
      const t = (40 - influence) / 40;
      fillColor = lerpColor(NEUTRAL_COLOR, RUNNER_COLOR, t);
    }
  }

  // Draw fill
  graphics.beginFill(fillColor, 0.6);
  graphics.moveTo(centerX + radius, centerY);
  for (let i = 1; i <= 6; i++) {
    const angle = (Math.PI / 3) * i;
    graphics.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle),
    );
  }
  graphics.closePath();
  graphics.endFill();

  // Draw border
  const borderColor = isSelected ? SELECTED_COLOR : 0x00ff88;
  const borderWidth = isSelected ? 3 : 1;
  graphics.setStrokeStyle({ width: borderWidth, color: borderColor });
  graphics.moveTo(centerX + radius, centerY);
  for (let i = 1; i <= 6; i++) {
    const angle = (Math.PI / 3) * i;
    graphics.lineTo(
      centerX + radius * Math.cos(angle),
      centerY + radius * Math.sin(angle),
    );
  }
  graphics.stroke();
}

function lerpColor(color1: number, color2: number, t: number): number {
  const r1 = (color1 >> 16) & 0xff;
  const g1 = (color1 >> 8) & 0xff;
  const b1 = color1 & 0xff;

  const r2 = (color2 >> 16) & 0xff;
  const g2 = (color2 >> 8) & 0xff;
  const b2 = color2 & 0xff;

  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);

  return (r << 16) | (g << 8) | b;
}

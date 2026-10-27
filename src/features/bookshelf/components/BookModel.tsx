import { useEffect } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  type Material,
  MeshStandardMaterial,
  Texture,
  Vector2,
} from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import {
  createCoverArtwork,
  createSpineArtwork,
} from "#/features/bookshelf/helper/book-artwork";
import type { BookDimensions } from "#/features/bookshelf/helper/book-dimensions";
import {
  cloneTexture,
  getClothNormalTexture,
  getPaperEdgeTexture,
} from "#/features/bookshelf/helper/procedural-textures";
import type { BookItem } from "#/shared/constant/book-items";

/** 직조 노멀맵 한 장(실 16가닥)이 1cm에 반복되는 횟수 */
const CLOTH_TILES_PER_CM = 1.4;
const CLOTH_NORMAL_SCALE = new Vector2(0.4, 0.4);
const PAPER_EDGE_CM_PER_REPEAT = 12;
const PAPER_COLOR = "#efe8d8";

const createBookParts = (book: BookItem, d: BookDimensions) => {
  const isHardcover = book.binding === "hardcover";
  const radius = d.thickness / 2;
  const spineZ = d.depth / 2 - radius * d.spineBulge;
  const boardLength = spineZ + d.depth / 2;
  const boardX = d.thickness / 2 - d.board / 2;
  const blockStart = -d.depth / 2 + d.overhang;
  const blockEnd = spineZ + (radius - d.board) * d.spineBulge * 0.6;
  const blockThickness = d.thickness - d.board * 2 - 0.02;
  const blockHeight = d.height - d.overhang * 2;

  const clothNormal = (width: number, height: number) =>
    isHardcover
      ? cloneTexture(
          getClothNormalTexture(),
          width * CLOTH_TILES_PER_CM,
          height * CLOTH_TILES_PER_CM,
        )
      : null;

  const coverBase = new MeshStandardMaterial({
    color: book.color,
    roughness: isHardcover ? 0.85 : 0.42,
    normalMap: clothNormal(boardLength, d.height),
    normalScale: CLOTH_NORMAL_SCALE,
  });

  const coverArt = createCoverArtwork(book, boardLength, d.height);
  const coverFace = new MeshStandardMaterial({
    map: coverArt.map,
    metalnessMap: coverArt.metalnessMap ?? null,
    metalness: coverArt.metalnessMap ? 1 : 0,
    roughness: isHardcover ? 0.6 : 0.4,
    normalMap: clothNormal(boardLength, d.height),
    normalScale: CLOTH_NORMAL_SCALE,
  });

  const spineArt = createSpineArtwork(book, d);
  const spine = new MeshStandardMaterial({
    map: spineArt.map,
    metalnessMap: spineArt.metalnessMap ?? null,
    metalness: spineArt.metalnessMap ? 1 : 0,
    roughness: isHardcover ? 0.6 : 0.4,
    normalMap: clothNormal(d.thickness * 1.6, d.height),
    normalScale: CLOTH_NORMAL_SCALE,
    side: DoubleSide,
  });

  const paperEdge = getPaperEdgeTexture();
  const edgeRepeat = blockThickness / PAPER_EDGE_CM_PER_REPEAT;
  const pageEdge = new MeshStandardMaterial({
    map: cloneTexture(paperEdge, edgeRepeat, 1),
    bumpMap: cloneTexture(paperEdge, edgeRepeat, 1),
    bumpScale: 0.6,
    roughness: 0.92,
  });
  const pagePlain = new MeshStandardMaterial({
    color: PAPER_COLOR,
    roughness: 0.92,
  });

  const boardGeometry = new RoundedBoxGeometry(
    d.board,
    d.height,
    boardLength,
    2,
    Math.min(d.board * 0.45, 0.1),
  );
  const blockGeometry = new BoxGeometry(
    blockThickness,
    blockHeight,
    blockEnd - blockStart,
  );
  const spineGeometry = new CylinderGeometry(
    radius,
    radius,
    d.height,
    32,
    1,
    true,
    -Math.PI / 2,
    Math.PI,
  );

  // BoxGeometry 면 순서: +x, -x, +y, -y, +z, -z
  const frontBoardMaterials = [
    coverFace,
    coverBase,
    coverBase,
    coverBase,
    coverBase,
    coverBase,
  ];
  const blockMaterials = [
    pagePlain,
    pagePlain,
    pageEdge,
    pageEdge,
    pagePlain,
    pageEdge,
  ];

  const materials: Material[] = [
    coverBase,
    coverFace,
    spine,
    pageEdge,
    pagePlain,
  ];
  const geometries = [boardGeometry, blockGeometry, spineGeometry];

  return {
    layout: {
      boardX,
      boardZ: (spineZ - d.depth / 2) / 2,
      blockZ: (blockStart + blockEnd) / 2,
      spineZ,
    },
    boardGeometry,
    blockGeometry,
    spineGeometry,
    coverBase,
    frontBoardMaterials,
    blockMaterials,
    spine,
    dispose: () => {
      for (const material of materials) {
        for (const value of Object.values(material)) {
          if (value instanceof Texture) value.dispose();
        }
        material.dispose();
      }
      for (const geometry of geometries) geometry.dispose();
    },
  };
};

interface BookModelProps {
  book: BookItem;
  dimensions: BookDimensions;
}

/** 표지판, 종이 뭉치, 둥근 책등으로 조립한 책 한 권의 형태. */
export function BookModel({ book, dimensions }: BookModelProps) {
  const parts = createBookParts(book, dimensions);

  useEffect(() => parts.dispose, [parts]);

  const { layout } = parts;

  return (
    <group>
      <mesh
        geometry={parts.boardGeometry}
        material={parts.coverBase}
        position={[-layout.boardX, 0, layout.boardZ]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={parts.boardGeometry}
        material={parts.frontBoardMaterials}
        position={[layout.boardX, 0, layout.boardZ]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={parts.blockGeometry}
        material={parts.blockMaterials}
        position={[0, 0, layout.blockZ]}
        castShadow
        receiveShadow
      />
      <mesh
        geometry={parts.spineGeometry}
        material={parts.spine}
        position={[0, 0, layout.spineZ]}
        scale={[1, 1, dimensions.spineBulge]}
        castShadow
        receiveShadow
      />
    </group>
  );
}

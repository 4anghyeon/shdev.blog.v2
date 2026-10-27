import { useTexture } from "@react-three/drei";
import { compact } from "es-toolkit";
import { useEffect } from "react";
import {
  BoxGeometry,
  CylinderGeometry,
  DoubleSide,
  type Material,
  MeshStandardMaterial,
  SRGBColorSpace,
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

/** 실제 책을 촬영하거나 스캔한 이미지. 없으면 코드로 그린 그림을 쓴다. */
interface BookImages {
  cover: Texture | null;
  spine: Texture | null;
}

const NO_IMAGES: BookImages = { cover: null, spine: null };

/** 실제 인쇄면은 코팅된 종이(양장본이면 띠지)라 천 질감과 박 없이 표현한다. */
const createPrintedMaterial = (image: Texture) =>
  new MeshStandardMaterial({ map: image, roughness: 0.42, side: DoubleSide });

const createCoverFace = (
  book: BookItem,
  width: number,
  height: number,
  clothNormal: Texture | null,
  coverImage: Texture | null,
) => {
  if (coverImage) return createPrintedMaterial(coverImage);
  const isHardcover = book.binding === "hardcover";
  const artwork = createCoverArtwork(book, width, height);
  return new MeshStandardMaterial({
    map: artwork.map,
    metalnessMap: artwork.metalnessMap ?? null,
    metalness: artwork.metalnessMap ? 1 : 0,
    roughness: isHardcover ? 0.6 : 0.4,
    normalMap: clothNormal,
    normalScale: CLOTH_NORMAL_SCALE,
  });
};

const createSpineFace = (
  book: BookItem,
  d: BookDimensions,
  clothNormal: Texture | null,
  spineImage: Texture | null,
) => {
  if (spineImage) return createPrintedMaterial(spineImage);
  const isHardcover = book.binding === "hardcover";
  const artwork = createSpineArtwork(book, d);
  return new MeshStandardMaterial({
    map: artwork.map,
    metalnessMap: artwork.metalnessMap ?? null,
    metalness: artwork.metalnessMap ? 1 : 0,
    roughness: isHardcover ? 0.6 : 0.4,
    normalMap: clothNormal,
    normalScale: CLOTH_NORMAL_SCALE,
    side: DoubleSide,
  });
};

/** 반원통 책등의 UV를 각도 대신 정면 기준 x 좌표로 펴서 이미지가 가장자리에서 눌리지 않게 한다. */
const createSpineGeometry = (radius: number, height: number) => {
  const geometry = new CylinderGeometry(
    radius,
    radius,
    height,
    32,
    1,
    true,
    -Math.PI / 2,
    Math.PI,
  );
  const position = geometry.getAttribute("position");
  const uv = geometry.getAttribute("uv");
  for (let i = 0; i < uv.count; i++) {
    uv.setX(i, (position.getX(i) / radius + 1) / 2);
  }
  return geometry;
};

const createBookParts = (
  book: BookItem,
  d: BookDimensions,
  images: BookImages,
) => {
  const isHardcover = book.binding === "hardcover";
  const radius = d.thickness / 2;
  const spineZ = d.depth / 2 - radius * d.spineBulge;
  const boardLength = spineZ + d.depth / 2;
  const boardX = d.thickness / 2 - d.board / 2;
  const blockStart = -d.depth / 2 + d.overhang;
  // 책등은 가장자리로 갈수록 뒤로 휘어서, 종이 뭉치가 휜 부분까지 들어가면 양옆으로 비어져 나온다
  const blockEnd = spineZ - 0.01;
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

  const coverFace = createCoverFace(
    book,
    boardLength,
    d.height,
    clothNormal(boardLength, d.height),
    images.cover,
  );
  const spine = createSpineFace(
    book,
    d,
    clothNormal(d.thickness * 1.6, d.height),
    images.spine,
  );

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
  const spineGeometry = createSpineGeometry(radius, d.height);

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
          // 실물 이미지는 useTexture 캐시가 다른 책과 공유하므로 여기서 해제하지 않는다
          const isSharedImage =
            value === images.cover || value === images.spine;
          if (value instanceof Texture && !isSharedImage) value.dispose();
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

/** 표지와 책등 이미지가 있으면 불러와서 입히고, 없는 면은 코드로 그린 그림을 쓰는 책 한 권. */
export function BookModel({ book, dimensions }: BookModelProps) {
  const imageUrls = compact([book.cover, book.spine]);
  if (imageUrls.length === 0) {
    return <BookMesh book={book} dimensions={dimensions} images={NO_IMAGES} />;
  }
  return (
    <ImageBook book={book} dimensions={dimensions} imageUrls={imageUrls} />
  );
}

interface ImageBookProps extends BookModelProps {
  imageUrls: string[];
}

function ImageBook({ book, dimensions, imageUrls }: ImageBookProps) {
  const textures = useTexture(imageUrls, (loaded) => {
    for (const texture of loaded) {
      texture.colorSpace = SRGBColorSpace;
      texture.anisotropy = 8;
    }
  });
  const textureOf = (url: string | undefined) =>
    url ? (textures[imageUrls.indexOf(url)] ?? null) : null;

  return (
    <BookMesh
      book={book}
      dimensions={dimensions}
      images={{ cover: textureOf(book.cover), spine: textureOf(book.spine) }}
    />
  );
}

interface BookMeshProps extends BookModelProps {
  images: BookImages;
}

/** 표지판, 종이 뭉치, 둥근 책등으로 조립한 책 한 권의 형태. */
function BookMesh({ book, dimensions, images }: BookMeshProps) {
  const parts = createBookParts(book, dimensions, images);

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

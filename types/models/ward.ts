export interface Geometry {
  type: "Polygon";
  coordinates: number[][][];
}

export interface Ward {
  wardNumber: number;
  wardAreaCode: number;
  geometry: Geometry;
  createdAt: string;
  updatedAt: string;
}

import { Model } from "@nozbe/watermelondb";
import { field, date, writer } from "@nozbe/watermelondb/decorators";
import { Geometry } from "@/types/models/ward";

export default class Ward extends Model {
  static table = "wards";

  //@ts-ignore
  @field("ward_number") wardNumber!: number;
  //@ts-ignore
  @field("ward_area_code") wardAreaCode!: number;
  //@ts-ignore
  @field("geometry") geometry!: string; // Stored as JSON string
  //@ts-ignore
  @date("created_at") createdAt!: Date;
  //@ts-ignore
  @date("updated_at") updatedAt!: Date;

  // Getters
  get parsedGeometry(): Geometry {
    return JSON.parse(this.geometry);
  }

  // Setters
  //@ts-ignore
  @writer async updateWard({
    wardNumber,
    wardAreaCode,
    geometry,
  }: {
    wardNumber?: number;
    wardAreaCode?: number;
    geometry?: Geometry;
  }) {
    await this.update((ward) => {
      if (wardNumber !== undefined) ward.wardNumber = wardNumber;
      if (wardAreaCode !== undefined) ward.wardAreaCode = wardAreaCode;
      if (geometry !== undefined) ward.geometry = JSON.stringify(geometry);
    });
  }
}

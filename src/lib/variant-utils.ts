import { ProductVariant, AvailabilityState } from "@/types";

/**
 * Extracts unique colors from variants while preserving order of first appearance.
 */
export function extractUniqueColors(variants: ProductVariant[]) {
  const colors = new Map<string, { colorHex: string | null; secondaryColorHex: string | null }>();
  variants.forEach(v => {
    if (v.color && !colors.has(v.color)) {
      colors.set(v.color, { colorHex: v.colorHex, secondaryColorHex: v.secondaryColorHex || null });
    }
  });
  return Array.from(colors.entries()).map(([value, { colorHex, secondaryColorHex }]) => ({ value, colorHex, secondaryColorHex }));
}

/**
 * Extracts unique sizes from variants while preserving order of first appearance.
 */
export function extractUniqueSizes(variants: ProductVariant[]) {
  const sizes = new Set<string>();
  variants.forEach(v => {
    if (v.size && !sizes.has(v.size)) {
      sizes.add(v.size);
    }
  });
  return Array.from(sizes).map(value => ({ value }));
}

/**
 * Builds a lookup matrix for variant availability.
 * Key: "dimension:value" (e.g., "color:Black")
 * Value: Set of values in the other dimension that are available for this choice.
 */
export function buildAvailabilityMatrix(variants: ProductVariant[]) {
  const matrix = new Map<string, Set<string>>();
  
  variants.forEach(v => {
    if (!v.isAvailable) return;
    
    if (v.color && v.size) {
      // color -> size
      const colorKey = `color:${v.color}`;
      if (!matrix.has(colorKey)) matrix.set(colorKey, new Set());
      matrix.get(colorKey)!.add(v.size);
      
      // size -> color
      const sizeKey = `size:${v.size}`;
      if (!matrix.has(sizeKey)) matrix.set(sizeKey, new Set());
      matrix.get(sizeKey)!.add(v.color);
    } else if (v.color) {
      const colorKey = `color:${v.color}`;
      if (!matrix.has(colorKey)) matrix.set(colorKey, new Set());
    } else if (v.size) {
      const sizeKey = `size:${v.size}`;
      if (!matrix.has(sizeKey)) matrix.set(sizeKey, new Set());
    }
  });
  
  return matrix;
}

/**
 * Finds the first available variant from the provided array.
 */
export function getDefaultVariant(variants: ProductVariant[]) {
  return variants.find(v => v.isAvailable) || variants[0] || null;
}

/**
 * Determines the availability state of an option given the current selection in the other dimension.
 */
export function getOptionAvailability(
  variants: ProductVariant[],
  matrix: Map<string, Set<string>>,
  dimension: "color" | "size",
  value: string,
  otherDimensionSelection: string | null
): AvailabilityState {
  // Check if globally OOS (isAvailable=false for all variants with this value)
  const allVariantsWithValue = variants.filter(v => v[dimension] === value);
  const isGloballyOos = allVariantsWithValue.every(v => !v.isAvailable);
  
  if (isGloballyOos) return "oos";
  
  // If no selection in other dimension, it's available (since not globally OOS)
  if (!otherDimensionSelection) return "available";
  
  // Check if available for the specific other dimension selection
  const key = `${dimension}:${value}`;
  const availablePartners = matrix.get(key);
  
  if (availablePartners && availablePartners.has(otherDimensionSelection)) {
    return "available";
  }
  
  return "disabled";
}

/**
 * Resolves a conflict when a new selection makes the other dimension's selection invalid.
 * Returns the first available value for the other dimension in display order.
 */
export function resolveConflict(
  variants: ProductVariant[],
  dimension: "color" | "size",
  newValue: string,
  otherDimension: "color" | "size",
  currentOtherValue: string | null
): string | null {
  const matrix = buildAvailabilityMatrix(variants);
  const key = `${dimension}:${newValue}`;
  const availablePartners = matrix.get(key);
  
  // If current other value is compatible, keep it
  if (currentOtherValue && availablePartners && availablePartners.has(currentOtherValue)) {
    return currentOtherValue;
  }
  
  // Otherwise, find the first available partner in display order
  if (availablePartners && availablePartners.size > 0) {
    const orderedPartners = otherDimension === "color" 
      ? extractUniqueColors(variants).map(o => o.value)
      : extractUniqueSizes(variants).map(o => o.value);
      
    return orderedPartners.find(p => availablePartners.has(p)) || null;
  }
  
  return null;
}

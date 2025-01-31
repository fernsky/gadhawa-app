import { FieldDependency } from "@/types/forms";
import { get } from "lodash";

/**
 * Evaluates a single dependency condition
 */
export function evaluateFieldDependency(
  dependency: FieldDependency,
  formValues: Record<string, any>
): boolean {
  const fieldValue = get(formValues, dependency.field);

  switch (dependency.operator) {
    case "equals":
      return fieldValue === dependency.value;

    case "notEquals":
      return fieldValue !== dependency.value;

    case "contains":
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(dependency.value);
      }
      return String(fieldValue).includes(String(dependency.value));

    case "greaterThan":
      return Number(fieldValue) > Number(dependency.value);

    case "lessThan":
      return Number(fieldValue) < Number(dependency.value);

    default:
      return false;
  }
}

/**
 * Evaluates multiple dependencies with AND logic
 */
export function evaluateDependencies(
  dependencies: FieldDependency[],
  formValues: Record<string, any>
): boolean {
  if (!dependencies?.length) return true;
  return dependencies.every((dep) => evaluateFieldDependency(dep, formValues));
}

/**
 * Evaluates complex dependency groups with AND/OR logic
 */
export function evaluateComplexDependencies(
  dependencyGroups: {
    operator: "AND" | "OR";
    dependencies: FieldDependency[];
  }[],
  formValues: Record<string, any>
): boolean {
  if (!dependencyGroups?.length) return true;

  return dependencyGroups.some((group) => {
    if (group.operator === "AND") {
      return evaluateDependencies(group.dependencies, formValues);
    }
    // OR logic
    return group.dependencies.some((dep) =>
      evaluateFieldDependency(dep, formValues)
    );
  });
}

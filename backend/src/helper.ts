import db from "./db.js";
import { Err } from "./Types.js";

function getOffset(currentPage = 1, listPerPage: number) {
  return (currentPage - 1) * listPerPage;
}

function emptyOrRows<T = any>(rows?: any[]) {
  if (!rows) return [];
  return rows as T[];
}

async function getPages(tableName: string, limit: number) {
  const query = `SELECT COUNT(*) FROM ${tableName}`;
  const result = await db.query(query);
  const count = parseInt(result.rows[0].count);

  if (!count) {
    throw new Err("No data found", 404);
  }

  return Math.ceil(count / limit);
}

function checkObject(obj: object, objectProperties: string[]) {
  objectProperties.forEach((property) => {
    if (!(property in obj)) {
      throw new Err(`${property} property is missing`, 400);
    }
  });
}

function getSQLOperator(operator?: string) {
  switch (operator?.toUpperCase()) {
    case "=":
    case "LIKE":
    case ">":
    case "<":
    case ">=":
    case "<=":
      return operator.toUpperCase();
    case "BETWEEN":
      return "BETWEEN";
    default:
      return "=";
  }
}

function buildFilterQuery(
  filter: string,
  startingParamIndex = 1,
): { query: string; queryParams: unknown[] } {
  try {
    const parsed = JSON.parse(filter) as {
      by: string;
      value: string | [string, string];
      operator?: string;
    }[];

    let query = " WHERE ";
    const queryParams: unknown[] = [];
    let paramIndex = startingParamIndex;

    for (const cond of parsed) {
      if (!cond.by || cond.value === undefined) continue;

      const sqlOp = getSQLOperator(cond.operator);

      if (sqlOp === "BETWEEN" && Array.isArray(cond.value)) {
        query += `"${cond.by}" BETWEEN $${paramIndex} AND $${paramIndex + 1} AND `;
        queryParams.push(cond.value[0], cond.value[1]);
        paramIndex += 2;
      } else {
        query += `"${cond.by}" ${sqlOp} $${paramIndex} AND `;
        queryParams.push(cond.value);
        paramIndex++;
      }
    }

    query = query.slice(0, -5); // Remove last ' AND '

    return { query, queryParams };
  } catch {
    throw new Err("Invalid filter query", 400);
  }
}

function buildSortQuery(sort: string): { query: string } {
  try {
    const parsed = JSON.parse(sort) as { by: string; order?: string };
    if (!parsed.by) return { query: "" };

    const order = parsed.order?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const query = ` ORDER BY "${parsed.by}" ${order}`;

    return { query };
  } catch {
    throw new Err("Invalid sort query", 400);
  }
}

function buildQuery(
  tableName: string,
  offset: number,
  limit: number,
  filter?: string,
  sort?: string,
): { query: string; queryParams: unknown[] } {
  let query = `SELECT * FROM "${tableName}"`;
  let queryParams: unknown[] = [];

  if (filter) {
    const filterPart = buildFilterQuery(filter, 1);
    query += filterPart.query;
    queryParams = queryParams.concat(filterPart.queryParams);
  }

  if (sort) {
    const sortPart = buildSortQuery(sort);
    query += sortPart.query;
  }

  query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
  queryParams.push(limit, offset);

  return { query, queryParams };
}

export default {
  getOffset,
  getPages,
  emptyOrRows,
  checkObject,
  buildFilterQuery,
  buildSortQuery,
  buildQuery,
};

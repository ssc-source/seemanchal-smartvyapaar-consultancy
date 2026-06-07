const { Op } = require('sequelize');

const toPositiveInteger = (value, fallback, max) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return fallback;
  return max ? Math.min(parsed, max) : parsed;
};

exports.getPagination = (query) => {
  const page = toPositiveInteger(query.page, 1);
  const limit = toPositiveInteger(query.limit, 100, 100);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

exports.buildSearchWhere = (query, fields = []) => {
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  const where = {};

  if (search && fields.length > 0) {
    where[Op.or] = fields.map((field) => ({
      [field]: { [Op.like]: `%${search}%` },
    }));
  }

  Object.entries(query).forEach(([key, value]) => {
    if (['page', 'limit', 'search', 'sortBy', 'sortOrder'].includes(key)) return;
    if (value === undefined || value === '') return;
    where[key] = value;
  });

  return where;
};

exports.buildOrder = (query, allowedFields = ['createdAt'], defaultOrder = [['createdAt', 'DESC']]) => {
  const sortBy = query.sortBy;
  if (!sortBy || !allowedFields.includes(sortBy)) return defaultOrder;

  const direction = String(query.sortOrder || 'ASC').toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  return [[sortBy, direction]];
};

exports.toListResponse = (result, page, limit) => ({
  data: result.rows,
  meta: {
    page,
    limit,
    total: result.count,
    totalPages: Math.ceil(result.count / limit) || 1,
  },
});

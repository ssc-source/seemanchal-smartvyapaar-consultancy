const { BlogCategory, BlogTag } = require('../models');

const blogCategories = [
  {
    name: 'News',
    slug: 'news',
    description: 'Latest announcements and agency updates.',
  },
  {
    name: 'Strategy',
    slug: 'strategy',
    description: 'Business strategy, growth planning, and market positioning.',
  },
  {
    name: 'Technology',
    slug: 'technology',
    description: 'Digital transformation, software systems, and product build.',
  },
  {
    name: 'Case Studies',
    slug: 'case-studies',
    description: 'Project stories, client outcomes, and practical results.',
  },
  {
    name: 'Insights',
    slug: 'insights',
    description: 'Thought leadership, trends, and advice for entrepreneurs.',
  },
];

const blogTags = [
  { name: 'growth', slug: 'growth' },
  { name: 'digital-transformation', slug: 'digital-transformation' },
  { name: 'marketing', slug: 'marketing' },
  { name: 'product', slug: 'product' },
  { name: 'strategy', slug: 'strategy' },
  { name: 'automation', slug: 'automation' },
  { name: 'design', slug: 'design' },
  { name: 'startup', slug: 'startup' },
];

exports.up = async () => {
  for (const category of blogCategories) {
    await BlogCategory.findOrCreate({
      where: { slug: category.slug },
      defaults: category,
    });
  }

  for (const tag of blogTags) {
    await BlogTag.findOrCreate({
      where: { slug: tag.slug },
      defaults: tag,
    });
  }
};

exports.down = async () => {
  await BlogCategory.destroy({ where: { slug: blogCategories.map((category) => category.slug) } });
  await BlogTag.destroy({ where: { slug: blogTags.map((tag) => tag.slug) } });
};

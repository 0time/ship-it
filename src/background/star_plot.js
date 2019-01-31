const addToAppStage = context => star => {
  context.app.stage.addChild(star);
  context.starField.contents.push(star);

  return star;
};

const createStarField = context =>
  initializeStars(context)(context.starField.size)
    .map(randomizeStarLocation(context))
    .map(addToAppStage(context));

const generateStar = context => () => {
  const star = new context.PIXI.Sprite(context.textures.star);

  star.anchor.x = 0.5;
  star.anchor.y = 0.7;

  return star;
};

const initializeStars = context => length =>
  new Array(length).fill(0).map(generateStar(context));

// TODO some of this from context?
const randomizeStarLocation = context => star => {
  const distance = Math.random() * 50 + 1;
  const radians = Math.random() * 2 * Math.PI;
  const starBaseSize = 0.05;
  const {height, width} = context.app.renderer.screen;

  star.z = Math.random() * 2000;
  star.x = Math.cos(radians) * (20 / star.z) * distance * width + width / 2;
  star.y = Math.sin(radians) * (20 / star.z) * distance * height + height / 2;

  const distanceScale = Math.max(0, (2000 - star.z) / 2000);

  star.scale.x = distanceScale * starBaseSize;
  star.scale.y = distanceScale * starBaseSize;

  return star;
};

module.exports = {
  addToAppStage,
  createStarField,
  generateStar,
  initializeStars,
  randomizeStarLocation,
};

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import { compose, curry } from 'ramda';

const COLORS = {
    RED: 'red',
    BLUE: 'blue',
    ORANGE: 'orange',
    GREEN: 'green',
    WHITE: 'white',
};

const SHAPES = {
    TRIANGLE: 'triangle',
    SQUARE: 'square',
    CIRCLE: 'circle',
    STAR: 'star',
};

const SHAPES_COUNT = 4;

const getColorsObject = () => Object.fromEntries(Object.values(COLORS).map(value => [value, 0]));

const equals = curry((expect, value) => value === expect);
const notEquals = curry((expect, value) => value !== expect);

const getValue = curry((field, object) => object[field]);

const getStar = getValue(SHAPES.STAR);
const getSquare = getValue(SHAPES.SQUARE);
const getTriangle = getValue(SHAPES.TRIANGLE);
const getCircle = getValue(SHAPES.CIRCLE);

const isWhite = equals(COLORS.WHITE);
const isRed = equals(COLORS.RED);
const isGreen = equals(COLORS.GREEN);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);

const isNotWhite = notEquals(COLORS.WHITE);
const isNotRed = notEquals(COLORS.RED);

const isWhiteTriangle = compose(isWhite, getTriangle);
const isWhiteCircle = compose(isWhite, getCircle);

const isGreenTriangle = compose(isGreen, getTriangle);

const isNotWhiteStar = compose(isNotWhite, getStar);
const isNotWhiteTriangle = compose(isNotWhite, getTriangle);
const isNotWhiteSquare = compose(isNotWhite, getSquare);

const isNotRedStar = compose(isNotRed, getStar);

const isRedStar = compose(isRed, getStar);

const isBlueCircle = compose(isBlue, getCircle);

const isGreenSquare = compose(isGreen, getSquare);

const isOrangeSquare = compose(isOrange, getSquare);

const getColorsCount = object => {
    const colorsObject = getColorsObject();
    Object.values(object).forEach(color => colorsObject[color]++);
    return colorsObject;
};

const getColorCount = curry((color, object) => Object.values(object).filter(value => value === color).length);

const getGreenCount = getColorCount(COLORS.GREEN);
const getRedCount = getColorCount(COLORS.RED);
const getOrangeCount = getColorCount(COLORS.ORANGE);

const redEqualsBlue = ({ red, blue }) => red === blue;

const atLeastTwoGreen = ({ green }) => green >= 2;

const atLeastThreeNotWhite = colors => Object.keys(colors).some(key => colors[key] >= 3 && key !== COLORS.WHITE);

const triangleEqualsSquare = ({ triangle, square }) => triangle === square;

const isAllSameColor = color => color === SHAPES_COUNT;

const exactlyTwoGreen = compose(green => green === 2, getGreenCount);

const exactlyOneRed = compose(red => red === 1, getRedCount); 

const allPass = func => {
    return (...args) => func.every(f => f(...args));
}

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isRedStar, isGreenSquare, isWhiteTriangle, isWhiteCircle]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(atLeastTwoGreen, getColorsCount);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(redEqualsBlue, getColorsCount);

// 4. Синий круг, красная звезда, оранжевый квадрат, треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isRedStar, isOrangeSquare]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = compose(atLeastThreeNotWhite, getColorsCount);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([isGreenTriangle, exactlyTwoGreen, exactlyOneRed]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(isAllSameColor, getOrangeCount);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([isNotRedStar, isNotWhiteStar]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(isAllSameColor, getGreenCount);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([isNotWhiteTriangle, isNotWhiteSquare, triangleEqualsSquare]);

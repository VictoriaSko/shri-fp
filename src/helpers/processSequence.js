/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import { otherwise, andThen, ifElse, allPass, compose } from 'ramda';

import Api from '../tools/api';

const api = new Api();

const NUMBER_API_URL = 'https://api.tech/numbers/base';
const ANIMAL_API_URL = 'https://animals.tech/';

const getRoundNumber = compose(Math.round, parseFloat);
const getValueSquare = andThen(value => Math.pow(value, 2));
const getRemainder = andThen(value => value % 3);
const getValueLength = andThen(value => value.length);

const valueHasRightLength = value => value.length < 10 && value.length > 2;
const isValidNumber = value => !isNaN(parseFloat(value)) && parseFloat(value) > 0;
const hasValidSymbols = value => new RegExp(/[0-9]+\.?[0-9]+/g).test(value);
const isValueValid = allPass([valueHasRightLength, hasValidSymbols, isValidNumber]);
const getValidationError = handleError => handleError.bind(null, 'ValidationError');

const getApiNumber = number => api.get(NUMBER_API_URL, { from: 10, to: 2, number });
const getApiAnimal = andThen(id => api.get(ANIMAL_API_URL + id, {}));
const getApiResult = compose(String, ({ result }) => result);
const thenApiResult = andThen(getApiResult);

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    writeLog(value);

    const logAndReturn = (value) => {
        writeLog(value);
        return value;
    };
    const thenWriteLog = andThen(logAndReturn);
    const thenHandleSuccess = andThen(handleSuccess);
    const otherwiseHandleError = otherwise(handleError);

    const handleValidationError = getValidationError(handleError);

    const process = compose(
        otherwiseHandleError, 
        thenHandleSuccess,
        thenApiResult,
        getApiAnimal,
        thenWriteLog, 
        getRemainder, 
        thenWriteLog, 
        getValueSquare, 
        thenWriteLog, 
        getValueLength, 
        thenWriteLog, 
        thenApiResult, 
        getApiNumber, 
        logAndReturn, 
        getRoundNumber
    );

    const conditionProcess = ifElse(isValueValid, process, handleValidationError);

    conditionProcess(value);
}

export default processSequence;

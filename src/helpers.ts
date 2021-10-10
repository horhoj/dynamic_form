// а этот хелпер создает массив длинны count
// массив заполнен нулями, но это значение не имеет
// важна лишь длинна массива
export const getArray = (count: number): number[] => {
  const result: number[] = [];
  for (let i = 1; i <= count; i++) {
    result.push(0);
  }
  return result;
};

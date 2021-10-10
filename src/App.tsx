import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import * as yup from 'yup';
import { Container } from './GlobalStyles';
import { useYupValidationResolver } from './hooks';
import { getArray } from './helpers';

//это список функций, которые создают наименование полей формы
//если надо добавить поле то нужно создать для него функцию генератор имени
const getFirstName = (count: number): string => `input_${count}_first_name`;
const getSecondName = (count: number) => `input_${count}_second_name`;
const getAgeName = (count: number) => `input_${count}_age`;

const getValidationSchema = (count: number) => {
  const obj: { [keys: string]: any } = {};
  for (let i = 0; i < count; i++) {
    //для каждого элемента формы создаем валидатор на yup
    //ОБЯЗАТЕЛЬНО использовать раннее созданные функции для наименования полей
    obj[getFirstName(i)] = yup.string().required();
    obj[getSecondName(i)] = yup.string().required();
    obj[getAgeName(i)] = yup.number().required();
  }

  return yup.object(obj);
};

export const App: React.FC = () => {
  const [count, setCount] = useState<number>(1);
  const resolver = useYupValidationResolver(getValidationSchema(count));
  const form = useForm<any>({ resolver });

  const [result, setResult] = useState('');

  const onSubmit = (data: any) => setResult(JSON.stringify(data, null, 2));

  const handleAddSubForm = () => {
    setCount((prev) => prev + 1);
  };
  const handleRemoveSubForm = () => {
    if (count > 1) {
      const newCount = count - 1;
      //необходимо обязательно при удалении субформы удалить значения
      //для последней удаленной субформы
      //иначе они пойдут в вывод формы
      delete form.control._formValues[getFirstName(newCount)];
      delete form.control._formValues[getSecondName(newCount)];
      delete form.control._formValues[getAgeName(newCount)];

      //устанавливаем счетчик
      setCount(newCount);
      //обнуляем результат
      setResult('');
    }
  };

  return (
    <Container>
      <Wrap>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {getArray(count).map((x, index) => (
            <P key={index + 1}>
              <SubForm>
                <P>SUBFORM # {index + 1}</P>
                <P>
                  <div>First name: </div>
                  <input
                    {...form.register(getFirstName(index))}
                    placeholder="First name"
                  />{' '}
                  <Error>
                    {' '}
                    {JSON.stringify(form.formState.errors[getFirstName(index)])}
                  </Error>
                </P>
                <P>
                  <div>SecondName: </div>
                  <input
                    {...form.register(getSecondName(index))}
                    placeholder="SecondName"
                  />{' '}
                  <Error>
                    {JSON.stringify(
                      form.formState.errors[getSecondName(index)],
                    )}
                  </Error>
                </P>
                <P>
                  <div>Age (NUMBER!!!): </div>
                  <input
                    {...form.register(getAgeName(index))}
                    placeholder="age"
                  />{' '}
                  <Error>
                    {JSON.stringify(form.formState.errors[getAgeName(index)])}
                  </Error>
                </P>
              </SubForm>
            </P>
          ))}
          <P>
            <Button type={'button'} onClick={handleAddSubForm}>
              Добавить
            </Button>
            {'  '}
            <Button type={'button'} onClick={handleRemoveSubForm}>
              Удалить
            </Button>
          </P>

          <P>
            <pre>результат: {result}</pre>
          </P>
          <P>
            <Button type="submit"> SUBMIT</Button>
          </P>
        </form>
      </Wrap>
    </Container>
  );
};

const Wrap = styled.div`
  padding: 30px;
`;

const P = styled.div`
  margin-top: 20px;
`;

const SubForm = styled.div`
  padding: 20px;
  border: 1px solid blue;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px;
`;

const Error = styled.div`
  color: red;
  font-size: 80%;
`;

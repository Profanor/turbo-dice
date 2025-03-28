import { useEffect, useRef } from 'react';

export function useAutoBet(
  rolling: boolean,
  result: number | null,
  autoBet: boolean,
  autoBetRounds: number,
  rollDice: () => void,
  setAutoBet: (value: boolean) => void,
) {
  const autoBetCountRef = useRef(0);

  useEffect(() => {
    if (autoBet) autoBetCountRef.current = 0;
  }, [autoBet]);

  useEffect(() => {
    if (!rolling && result !== null && autoBet) {
      autoBetCountRef.current += 1;
      if (autoBetCountRef.current < autoBetRounds) {
        rollDice();
      } else {
        setAutoBet(false);
      }
    }
  }, [rolling, result, autoBet, autoBetRounds, rollDice, setAutoBet]);
}

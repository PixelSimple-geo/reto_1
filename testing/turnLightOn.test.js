const hasTrainMoved = (value1, value2) => value1 !== value2;

describe('hasTrainMoved', () => {
    it('scuando sean diferentes deberia devolver "true"', () => {
        const mem_posizioa = 1;
        const mem_posizioaTemp = 2;
        const result = hasTrainMoved(mem_posizioa, mem_posizioaTemp);
        expect(result).toBe(true);
    });

    it('cuando sean iguales deberia devolver "false"', () => {
        const mem_posizioa = 1;
        const mem_posizioaTemp = 1;
        const result = hasTrainMoved(mem_posizioa, mem_posizioaTemp);
        expect(result).toBe(false);
    });
});
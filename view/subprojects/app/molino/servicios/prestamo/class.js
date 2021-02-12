class Cronograma {
  constructor(fecha_inicial, fecha_final, capital, interes, amortizacion, cuota, dias = 0, factor = 0, seguro = 0, itf = 0) {
    this.fecha_inicial = fecha_inicial;
    this.fecha_final = fecha_final;
    this.capital = capital;
    this.interes = interes;
    this.amortizacion = amortizacion;
    this.cuota = cuota;
    this.dias = dias;
    this.factor = factor;
    this.seguro = seguro;
    this.itf = itf;
  }
}
class Factor_Prestamo {
  constructor(fecha_inicial, fecha_final, dias = 0, factor = 0) {
    this.fecha_inicial = fecha_inicial;
    this.fecha_final = fecha_final;
    this.dias = dias;
    this.factor = factor;
  }
}


var listCronograma = [];
var listFactor = [];


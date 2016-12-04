using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ConsultarFichaRequestDTO
    {
        public int CodigoFichaMantenimiento { get; set; }
        public string DescripcionFicha { get; set; }
        public int CodigoTipoMantenimiento { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int EstadoFichaMantenimiento { get; set; }
        public int CodigoSede { get; set; }
        public int CodigoArea { get; set; }
        public string OrdenCampo { get; set; }
        public string OrdenOrientacion { get; set; }
        public int PaginaActual { get; set; }
        public int NroRegistrosPorPagina { get; set; }
        public int TotalRegistros { get; set; }
        public int CantidadPaginas { get; set; }
    }
}
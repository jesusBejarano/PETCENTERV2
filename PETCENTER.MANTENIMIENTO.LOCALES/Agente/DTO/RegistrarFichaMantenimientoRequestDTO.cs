using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class RegistrarFichaMantenimientoRequestDTO
    {
        public int CodigoFichaMantenimiento { get; set; }
        public int CodigoMantenimiento { get; set; }
        public int CodigoEmpleado { get; set; }
        public string Descripcion { get; set; }
        public DateTime Fecha { get; set; }
        public DateTime FechaInicio { get; set; }
        public DateTime FechaFin { get; set; }
        public int CantidadTecnicos { get; set; }
        public int Estado { get; set; }
        public string UsuarioRegistro { get; set; }
        public DateTime FechaHoraRegistro { get; set; }
        public string Accion { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO
{
    public class ObtenerFichaMantenimientoResponseDTO
    {
        public int CodigoFichaMantenimiento { get; set; }
 
        public int CodigoMantenimiento { get; set; }
    
        public int CodigoSolicitud { get; set; }
        
        public int CodigoTipoMantenimiento { get; set; }
     
        public string DescripcionTipoMantenimiento { get; set; }
        
        public int CodigoEmpleadoAprueba { get; set; }
      
        public string NombreEmpleadoAprueba { get; set; }
        
        public int CodigoArea { get; set; }
    
        public string DescripcionAreaMantenimiento { get; set; }
       
        public string DescrpcionFichaMantenimiento { get; set; }

        public DateTime FechaFichaMantenimiento { get; set; }
       
        public DateTime FechaInicioFichaMantenimiento { get; set; }

        public DateTime FechaFinFichaMantenimiento { get; set; }
      
        public int CantidadTecnicosFichaMantenimiento { get; set; }
        
        public int CodigoEstadoFichaMantenimiento { get; set; }
      
        public string DescrpcionEstadoFichaMantenimiento { get; set; }
     
        public string UsuarioCreacion { get; set; }
     
        public DateTime FechaHoraCreacion { get; set; }
       
        public string UsuarioActualizacion { get; set; }
    
        public DateTime FechaHoraActualizacion { get; set; }
      
        public Boolean EstadoRegistro { get; set; }
    
        public int CodigoSede { get; set; }
      
        public string DescripcionSedeMantenimiento { get; set; }
    }
}
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;
using System.Web.UI.WebControls;
using PETCENTER.MANTENIMIENTO.LOCALES.Agente.DTO;
using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using PETCENTER.MANTENIMIENTO.LOCALES.Models;
using PETCENTER.MANTENIMIENTO.LOCALES.Proxy;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Agente.BL
{
    public class FichaAgente
    {
        static readonly object _locker = new object();
        public List<EstadoFicha> ObtenerEstados()
        {
            var responseEstadoFicha = new MaestrosProxyrest().ConsultarEstadoFichaMantenimiento();
            return responseEstadoFicha.EstadoFichaMatenimientoList .Select(item => new EstadoFicha
            {
                Codigo = item.CodigoEstadoFichaMantenimiento ,
                Descripcion = item.Nombre
            }).ToList();
        }
        public List<TipoMantenimiento> ObtenerTipoMantenimiento()
        {
            var responseTipoMantenimiento = new MaestrosProxyrest().ConsultarTipoMantenimiento();
            return responseTipoMantenimiento.TipoMantenimientoList.Select(item => new TipoMantenimiento
            {
                Codigo = item.CodigoTipoMantenimiento.ToString(),
                Descripcion = item.Nombre
            }).ToList();
        }
        public List<Sede> ObtenerSede()
        {
            var responseTipoMantenimiento = new MaestrosProxyrest().ConsultarSede();
            return responseTipoMantenimiento.SedeList.Select(item => new Sede
            {
                Codigo = item.CodigoSede.ToString(),
                Descripcion = item.Nombre
            }).ToList();
        }
        public List<Area> ObtenerArea()
        {
            var responseTipoMantenimiento = new MaestrosProxyrest().ConsultarArea();
            return responseTipoMantenimiento.AreaList.Select(item => new Area
            {
                Codigo = item.CodigoArea.ToString(),
                Descripcion = item.Nombre
            }).ToList();
        }

        public List<ConsultaFichaModel> BusquedaFichas(ConsultaFichaRequestViewModel request)
        {

            this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", "demo", Environment.NewLine));

            this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", request.FechaInicioFinal.ToShortDateString(), Environment.NewLine));
            this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", request.FechaFinFinal.ToShortDateString(), Environment.NewLine));
            var lstFicha= new List<ConsultaFichaModel>();
            try
            {
                var requestdDto = new ConsultarFichaRequestDTO();
                requestdDto.CantidadPaginas = 1;
                requestdDto.NroRegistrosPorPagina = 100;
                requestdDto.PaginaActual = 1;
                requestdDto.TotalRegistros = 100;

                requestdDto.EstadoFichaMantenimiento = request.Estado;
                requestdDto.CodigoArea = request.CodigoArea;
                requestdDto.CodigoSede = request.CodigoSede;
                requestdDto.CodigoFichaMantenimiento = request.CodigoFichaMantenimiento;
                requestdDto.CodigoTipoMantenimiento = request.CodigoTipoMantenimiento;
                requestdDto.FechaFin = request.FechaFinFinal;
                requestdDto.FechaInicio = request.FechaInicioFinal;
                requestdDto.DescripcionFicha = request.Descripcion;

                var responseFicha = new FichaProxyrest().ConsultarFicha(requestdDto);

                foreach (var item in responseFicha.FichaMantenimientoList)
                {
                    var demo = new ConsultaFichaModel
                    {
                        Area = item.DescripcionAreaMantenimiento ,
                        Descripcion=item.DescripcionFichaMantenimiento ,
                        Codigo = item.CodigoFichaMantenimiento ,
                        Estado = item.DescrpcionEstadoFichaMantenimiento ,
                        FechaHoraCreacion = string.Format("{0:dd/MM/yyyy}", item.FechaHoraCreacion),//item.FechaHoraCreacion.ToShortDateString(),
                        Sede = item.DescripcionSedeMantenimiento,
                        TipoMantenimiento = item.DescripcionTipoMantenimiento
                    };
                    lstFicha.Add(demo);
                }
            }
            catch (Exception ex)
            {
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.Message, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.InnerException, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.StackTrace, Environment.NewLine));
            }


            return lstFicha;
        }

        public DetalleFicha ObtenerDetalleFicha(int codigoFicha)
        {
            var requestDto = new ObtenerFichaRequestDTO();
            requestDto.CodigoSolicitud = codigoFicha;
            var responseDetalleFicha = new FichaProxyrest().ObtenerFicha(requestDto);

            var resultado = new DetalleFicha();
            resultado.Descripcion = responseDetalleFicha.DescripcionSolicitud;
            resultado.CodigoArea = responseDetalleFicha.CodigoArea.ToString();
            resultado.CodigoSede = responseDetalleFicha.CodigoSede.ToString();
            resultado.CodigoTipoMantenimiento = responseDetalleFicha.CodigoTipoMantenimiento.ToString();
            resultado.FechaSolicitud = string.Format("{0:dd/MM/yyyy}", responseDetalleFicha.FechaSolicitud); //responseDetalleSolicitud.FechaSolicitud.ToShortDateString();
            resultado.NumeroSolicitud = responseDetalleFicha.CodigoSolicitud;

            foreach (var item in responseDetalleFicha.ListaMantenimientos)
            {
                resultado.ListaMantenimiento.Add(new MantenimientoViewModel
                {
                    Codigo = item.CodigoMantenimiento.ToString(),
                    Descripcion = item.Descripcion,
                    Nombre = item.Nombre,
                    FechaMantenimiento = item.Fecha.ToShortDateString()
                });
            }
            return resultado;
        }
        public RegistrarFichaResponseViewModel RegistrarFicha(RegistrarFicha request)
        {
            var resultado = new RegistrarFichaResponseViewModel();
            try
            {
                var requestDto = new RegistrarFichaRequestDTO();
                requestDto.Accion = "I";
                requestDto.Descripcion = request.Descripcion;
                requestDto.CodigoArea = int.Parse(request.CodigoArea);
                requestDto.CodigoSede = int.Parse(request.CodigoSede);
                requestDto.CodigoEmpleado1 = 1;
                requestDto.CodigoSolicitud = request.NumeroSolicitud;
                requestDto.CodigoTipoMantenimiento = int.Parse(request.CodigoTipoMantenimiento);
                requestDto.Estado = 1;
                var lstFechas = request.FechaSolicitud.Split('/');
                var fechaFinal = lstFechas[2] + '/' + lstFechas[1] + '/' + lstFechas[0];
                requestDto.Fecha = Convert.ToDateTime(fechaFinal);
                requestDto.FechaHoraRegistro = DateTime.Now;
                requestDto.UsuarioRegistro = "Anderson";

                foreach (var item in request.ListaMantenimiento)
                {
                    var lstFechasDet = item.FechaMantenimiento.Split('/');
                    var fechaFinalDet = lstFechasDet[2] + '/' + lstFechasDet[1] + '/' + lstFechasDet[0];
                    requestDto.MantenimientoList.Add(new MantenimientoListDTO
                    {
                        Accion = "I",
                        Descripcion = item.Descripcion,
                        Nombre = item.Nombre,
                        CodigoMantenimiento = int.Parse(item.Codigo),
                        FechaHoraCreacion = DateTime.Now,
                        Fecha = Convert.ToDateTime(fechaFinalDet),
                        UsuarioCreacion = "Anderson"
                    });
                }

                var responseDetalleFicha = new FichaProxyrest().RegistrarFicha(requestDto);

                if (responseDetalleFicha.Result.Satisfactorio)
                    resultado.Result.Satisfactorio = true;
            }
            catch (Exception ex)
            {
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.Message, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.InnerException, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.StackTrace, Environment.NewLine));
            }
            return resultado;
        }
        public RegistrarFichaResponseViewModel DeshabilitarFicha(RegistrarFicha request)
        {
            var resultado = new RegistrarFichaResponseViewModel();
            try
            {
                var requestDto = new RegistrarFichaRequestDTO();
                requestDto.Accion = "D";
                requestDto.Descripcion = request.Descripcion;
                requestDto.CodigoArea = int.Parse(request.CodigoArea);
                requestDto.CodigoSede = int.Parse(request.CodigoSede);
                requestDto.CodigoEmpleado1 = 1;
                requestDto.CodigoSolicitud = request.NumeroSolicitud;
                requestDto.CodigoTipoMantenimiento = int.Parse(request.CodigoTipoMantenimiento);
                requestDto.Estado = 1;
                var lstFechas = request.FechaSolicitud.Split('/');
                var fechaFinal = lstFechas[2] + '/' + lstFechas[1] + '/' + lstFechas[0];
                requestDto.Fecha = Convert.ToDateTime(fechaFinal);
                requestDto.FechaHoraRegistro = DateTime.Now;
                requestDto.UsuarioRegistro = "Anderson";

                var responseDetalleFicha = new FichaProxyrest().RegistrarFicha(requestDto);

                if (responseDetalleFicha.Result.Satisfactorio)
                    resultado.Result.Satisfactorio = true;
            }
            catch (Exception ex)
            {
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.Message, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.InnerException, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.StackTrace, Environment.NewLine));
            }
            return resultado;
        }
        public RegistrarFichaResponseViewModel ActualizarFicha(RegistrarFicha request)
        {
            var resultado = new RegistrarFichaResponseViewModel();
            try
            {
                var requestDto = new RegistrarFichaRequestDTO();
                requestDto.Accion = "U";
                requestDto.Descripcion = request.Descripcion;
                requestDto.CodigoArea = int.Parse(request.CodigoArea);
                requestDto.CodigoSede = int.Parse(request.CodigoSede);
                requestDto.CodigoEmpleado1 = 1;
                requestDto.CodigoSolicitud = request.NumeroSolicitud;
                requestDto.CodigoTipoMantenimiento = int.Parse(request.CodigoTipoMantenimiento);
                requestDto.Estado = 1;
                var lstFechas = request.FechaSolicitud.Split('/');
                var fechaFinal = lstFechas[2] + '/' + lstFechas[1] + '/' + lstFechas[0];
                requestDto.Fecha = Convert.ToDateTime(fechaFinal);
                requestDto.FechaHoraRegistro = DateTime.Now;
                requestDto.UsuarioRegistro = "Anderson";

                foreach (var item in request.ListaMantenimiento)
                {
                    var lstFechasDet = item.FechaMantenimiento.Split('/');
                    var fechaFinalDet = lstFechasDet[2] + '/' + lstFechasDet[1] + '/' + lstFechasDet[0];
                    requestDto.MantenimientoList.Add(new MantenimientoListDTO
                    {
                        Accion = "I",
                        Descripcion = item.Descripcion,
                        Nombre = item.Nombre,
                        CodigoMantenimiento = 0,
                        FechaHoraCreacion = DateTime.Now,
                        Fecha = Convert.ToDateTime(fechaFinalDet),
                        UsuarioCreacion = "Anderson"
                    });
                }
                var responseDetalleFicha = new FichaProxyrest().RegistrarFicha(requestDto);

                if (responseDetalleFicha.Result.Satisfactorio)
                    resultado.Result.Satisfactorio = true;
            }
            catch (Exception ex)
            {
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.Message, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.InnerException, Environment.NewLine));
                this.RegistrarEvento(@"C:\LOG\logPetCenter.text", string.Format("{0}{1}", ex.StackTrace, Environment.NewLine));
            }
            return resultado;
        }
        private void RegistrarEvento(string ruta, string mensaje)
        {
            try
            {
                lock (_locker)
                {
                    StreamWriter log;

                    if (!File.Exists(ruta))
                        log = new StreamWriter(ruta, true, Encoding.Default);
                    else
                        log = File.AppendText(ruta);

                    using (log)
                    {
                        log.WriteLine(mensaje);
                        log.Close();
                    }
                }
            }
            catch (Exception ex)
            {

            }
        }
    }
}
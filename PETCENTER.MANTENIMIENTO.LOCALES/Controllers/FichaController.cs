using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using Newtonsoft.Json;
using PETCENTER.MANTENIMIENTO.LOCALES.Agente.BL;
using PETCENTER.MANTENIMIENTO.LOCALES.Comun;
using PETCENTER.MANTENIMIENTO.LOCALES.Filters;
using PETCENTER.MANTENIMIENTO.LOCALES.Models;

namespace PETCENTER.MANTENIMIENTO.LOCALES.Controllers
{

    public class FichaController : Controller
    {
        //
        // GET: /Solicitud/

        public ActionResult Index()
        {
            ActionResult actionResult = null;
            var busquedaFicha = new BusquedaFichaIndexViewModel();
            var agenteFicha = new FichaAgente(); ;
            try
            {

                busquedaFicha.TipoMantenimiento = agenteFicha.ObtenerTipoMantenimiento();
                busquedaFicha.Estado = agenteFicha.ObtenerEstados();
                busquedaFicha.Area = agenteFicha.ObtenerArea();
                busquedaFicha.Sede = agenteFicha.ObtenerSede();
                busquedaFicha.FechaInicio = string.Format("{0:dd/MM/yyyy}", DateTime.Now.AddDays(-30));
                busquedaFicha.FechaFin = string.Format("{0:dd/MM/yyyy}", DateTime.Now);

                actionResult = Content(JsonConvert.SerializeObject(busquedaFicha));
            }
            catch (Exception ex)
            {
                var msj = ex.Message;
            }
            return actionResult;
        }

        public ActionResult ObtenerFichas(ConsultaFichaRequestViewModel request)
        {
            ActionResult actionResult = null;


            var responseViewModel = new ResponseBusquedaFichaViewModel();
            responseViewModel.ListaFicha = new FichaAgente().BusquedaFichas (request);
            //var listaRespuesta = responseViewModel;
            //var totalPages = int.Parse("" + Math.Ceiling(Convert.ToDouble(listaRespuesta.TotalRegistros)/10));
            //var res = Grid.toJSONFormat2(listaRespuesta.ListaSolicitud, 1, listaRespuesta.TotalRegistros, totalPages,
            //    "Codigo");
            actionResult = Content(JsonConvert.SerializeObject(responseViewModel));
            return actionResult;
        }

        public ActionResult ObtenerDetalleFicha(int codigoSolicitud)
        {
            ActionResult actionResult = null;
            var responseViewModel = new FichaAgente().ObtenerDetalleFicha(codigoSolicitud);
            actionResult = Content(JsonConvert.SerializeObject(responseViewModel));
            return actionResult;
        }
        public ActionResult RegistrarFicha(string request)
        {
            ActionResult actionResult = null;
            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            var datos = jsonSerializer.Deserialize<RegistrarFicha>(request);
            var responseViewModel = new FichaAgente().RegistrarFicha(datos);
            actionResult = Content(JsonConvert.SerializeObject(responseViewModel));
            return actionResult;
        }
        public ActionResult DeshabilitarFicha(string request)
        {
            ActionResult actionResult = null;
            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            var datos = jsonSerializer.Deserialize<RegistrarFicha>(request);
            var responseViewModel = new FichaAgente().DeshabilitarFicha(datos);
            actionResult = Content(JsonConvert.SerializeObject(responseViewModel));
            return actionResult;
        }
        public ActionResult ActualizarFicha(string request)
        {
            ActionResult actionResult = null;
            JavaScriptSerializer jsonSerializer = new JavaScriptSerializer();
            var datos = jsonSerializer.Deserialize<RegistrarFicha>(request);
            var responseViewModel = new FichaAgente().ActualizarFicha(datos);
            actionResult = Content(JsonConvert.SerializeObject(responseViewModel));
            return actionResult;
        }

        public ActionResult ConsultaFicha()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult RegistroFicha()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult AgregarMantenimiento()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult BuscarMantenimiento()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult BuscarSolicitudFicha()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult BuscarActividad()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
        public ActionResult BuscarMateriales()
        {
            ViewBag.Message = "Modifique esta plantilla para poner en marcha su aplicación ASP.NET MVC.";

            return View();
        }
    }
}

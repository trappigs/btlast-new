using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ViewEngines;
using Umbraco.Cms.Core.Web;
using Umbraco.Cms.Web.Common.Controllers;
using btlast.Services;
using Umbraco.Cms.Core.Models.PublishedContent;

namespace btlast.Controller
{
    public class ProjectDetailPageController : RenderController
    {
        private readonly IMetaCapiService _metaCapiService;

        public ProjectDetailPageController(
            ILogger<RenderController> logger,
            ICompositeViewEngine compositeViewEngine,
            IUmbracoContextAccessor umbracoContextAccessor,
            IMetaCapiService metaCapiService)
            : base(logger, compositeViewEngine, umbracoContextAccessor)
        {
            _metaCapiService = metaCapiService;
        }

        public override IActionResult Index()
        {
            // 1. Generate Unique Event ID
            string eventId = Guid.NewGuid().ToString();

            // 2. Pass Event ID to View (for Pixel)
            ViewBag.EventId = eventId;

            // 3. Send CAPI Event (Fire & Forget)
            // Use CurrentPage property available in RenderController
            string contentName = CurrentPage.Name;
            string userAgent = Request.Headers["User-Agent"].ToString();
            string userIp = HttpContext.Connection.RemoteIpAddress?.ToString();
            string currentUrl = Request.Scheme + "://" + Request.Host + Request.Path;
            
            // Extract Meta Cookies for better matching
            string fbp = Request.Cookies["_fbp"];
            string fbc = Request.Cookies["_fbc"];

            // Run in background to avoid blocking page load
            Task.Run(async () => 
            {
                await _metaCapiService.SendViewContentEventAsync(eventId, contentName, "ProjectPage", userAgent, userIp, currentUrl, fbp, fbc);
            });

            // 4. Return the View
            // Use CurrentTemplate(CurrentPage) or just CurrentTemplate(new ContentModel(CurrentPage))
            // CurrentTemplate(CurrentPage) is standard if the view expects IPublishedContent or inherits generic
            return CurrentTemplate(CurrentPage);
        }
    }
}

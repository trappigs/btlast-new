using System.Threading.Tasks;

namespace btlast.Services
{
    public interface IMetaCapiService
    {
        Task SendLeadEventAsync(string eventId, string email, string phone, string source, string userAgent, string userIp, string fbp, string fbc);
        Task SendViewContentEventAsync(string eventId, string contentName, string source, string userAgent, string userIp, string currentUrl, string fbp, string fbc);
        Task SendEventAsync(string eventName, string eventId, string email, string phone, string source, string userAgent, string userIp, string fbp, string fbc);
    }
}

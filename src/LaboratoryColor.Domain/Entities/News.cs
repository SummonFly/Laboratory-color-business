using LaboratoryColor.Domain.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaboratoryColor.Domain.Entities
{
    public class News : BaseEntity
    {
        public string Title { get; private set; }
        public string Content { get; private set; }
        public DateTime PublishedDate { get; private set; }
        public string? ImageUrl { get; private set; }
        public string? Excerpt { get; private set; }

        // For EF
        public virtual ICollection<Image> Images { get; set; } = new List<Image>();
        //public IReadOnlyCollection<Image> Images => _images.AsReadOnly();

        private readonly List<Image> _images = new();

        public Image? MainImage => _images.FirstOrDefault(i => i.IsMain);
        public IEnumerable<Image> GalleryImages => _images.Where(i => !i.IsMain).OrderBy(i => i.DisplayOrder);

        private News() { }

        public News(string title, string content)
        {
            Title = title;
            Content = content;
            PublishedDate = DateTime.UtcNow;
        }

        public void AddImage(Image image)
        {
            _images.Add(image);
        }

        public void SetExcerpt(string? excerpt)
        {
            Excerpt = excerpt;
        }
    }
}

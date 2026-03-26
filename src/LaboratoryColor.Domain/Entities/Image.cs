using LaboratoryColor.Domain.Common;

namespace LaboratoryColor.Domain.Entities
{
    public class Image : BaseEntity
    {
        public string FileName { get; private set; }
        public string FilePath { get; private set; }
        public string? ThumbnailPath { get; private set; }
        public long FileSize { get; private set; }
        public string? AltText { get; private set; }
        public int DisplayOrder { get; private set; }
        public bool IsMain { get; private set; }

        public int? ProductId { get; private set; }
        public Product? Product { get; private set; }
        //public int? NewsId { get; private set; }
        //public News? News { get; private set; }

        private Image() { }

        public Image(string fileName, string filePath, long fileSize)
        {
            FileName = fileName;
            FilePath = filePath;
            FileSize = fileSize;
        }

        public void SetAsMain() => IsMain = true;
        public void SetDisplayOrder(int order) => DisplayOrder = order;
        public void UpdateAltText(string? altText) => AltText = altText;
    }
}

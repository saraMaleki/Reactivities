

namespace Application.Comments
{
    public class CommentDto
    {
        public int Id { get; set; }
        public DateTime CreateAt { get; set; }
        public string? body { get; set; }

        public string? Username { get; set; }
        public string? DisplayName { get; set; }
        public string? Image { get; set; }
        
    }
}
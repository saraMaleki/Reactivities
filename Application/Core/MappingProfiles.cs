using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(t => t.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(t => t.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(t => t.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(t => t.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(t=> t.Image, o => o.MapFrom(s=>s.AppUser.Photos.FirstOrDefault(x =>x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(t=> t.Image, o => o.MapFrom(s=>s.Photos.FirstOrDefault(x =>x.IsMain).Url));

            CreateMap<Comment,CommentDto>()
            .ForMember(t => t.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(t => t.Username, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(t=> t.Image, o => o.MapFrom(s=>s.Author.Photos.FirstOrDefault(x =>x.IsMain).Url));

        }
    }
}
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
            string? currentUsername = null;
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
            .ForMember(t => t.HostUsername, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
            .ForMember(t => t.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(t => t.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(t => t.Username, o => o.MapFrom(s => s.AppUser.UserName))
            .ForMember(t => t.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
             .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
            .ForMember(d => d.Following,
            o => o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<AppUser, Profiles.Profile>()
            .ForMember(t => t.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
            .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.Followers.Count))
            .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.Followings.Count))
            .ForMember(d => d.Following,
            o => o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUsername)));

            CreateMap<Comment, CommentDto>()
            .ForMember(t => t.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
            .ForMember(t => t.Username, o => o.MapFrom(s => s.Author.UserName))
            .ForMember(t => t.Image, o => o.MapFrom(s => s.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ActivityAttendee,Application.Profiles.UserActivityDto>()
            .ForMember(d=>d.Id, o=>o.MapFrom(s=>s.Activity.Id))
            .ForMember(d=>d.Date, o=>o.MapFrom(s=>s.Activity.Date))
            .ForMember(d=>d.Title, o=>o.MapFrom(s=>s.Activity.Title))
            .ForMember(d=>d.Category, o=>o.MapFrom(s=>s.Activity.Category))
            .ForMember(d=>d.HostUsername, o=>o.MapFrom(s=>
            s.Activity.Attendees.FirstOrDefault(x=>x.IsHost).AppUser.UserName));
        }
    }
}
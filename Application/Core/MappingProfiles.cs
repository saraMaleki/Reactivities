using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
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

            CreateMap<ActivityAttendee, Profiles.Profile>()
            .ForMember(t => t.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            .ForMember(t => t.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            .ForMember(t => t.Username, o => o.MapFrom(s => s.AppUser.UserName));

        }
    }
}
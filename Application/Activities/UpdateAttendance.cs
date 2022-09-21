using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext datacontext, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = datacontext;
            }
            public async Task<Result<Unit>> Handle(command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities
                .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                .SingleOrDefaultAsync(it => it.Id == request.Id);

                if (activity == null) return null;

                var user = await _dataContext.Users.SingleOrDefaultAsync(u => u.UserName == _userAccessor.GetUsername());

                if (user == null) return null;

                var hostUsername = activity.Attendees.FirstOrDefault(u => u.IsHost)?.AppUser?.UserName;

                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if (attendance != null && hostUsername == user.UserName)
                {
                    activity.IsCancelled = !activity.IsCancelled;
                }
                if (attendance != null && hostUsername != user.UserName)
                {
                    activity.Attendees.Remove(attendance);
                }
                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                        IsHost = false
                    };
                    activity.Attendees.Add(attendance);
                }
                var result = await _dataContext.SaveChangesAsync() > 0;
                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("problem updating activity");
            }
        }
    }
}

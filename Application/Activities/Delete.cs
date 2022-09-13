using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }
        public class handler : IRequestHandler<command, Result<Unit>>
        {
            private readonly DataContext _dataContext;

            public handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Id);
                if (activity == null) return null;

                _dataContext.Remove(activity);
                var result = await _dataContext.SaveChangesAsync() > 0;
                if (!result) return Result<Unit>.Failure("Failed to delete");

                return Result<Unit>.Success(Unit.Value);
            }
        }

    }
}
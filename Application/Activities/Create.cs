using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class command : IRequest
        {
           public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<command>
        {
            public readonly DataContext _dataContext;
            public Handler(DataContext datacontext)
            {
                _dataContext =datacontext;
            }
            public async Task<Unit> Handle(command request, CancellationToken cancellationToken)
            {
               _dataContext.Activities.Add(request.Activity);
               await _dataContext.SaveChangesAsync();
               return Unit.Value;
            }
        }
    }
}
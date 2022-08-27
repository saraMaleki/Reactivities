using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class command : IRequest
        {
            public Activity Activity { get; set; }
        }
        public class Handler : IRequestHandler<command>
        {
            public readonly DataContext _dataContext;
            public readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext=dataContext;
                _mapper = mapper;
            }

            public DataContext Context { get; }

            public async Task<Unit> Handle(command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);
                // activity.Title = request.Activity.Title ?? activity.Title;

                _mapper.Map(request.Activity,activity);
                _dataContext.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}
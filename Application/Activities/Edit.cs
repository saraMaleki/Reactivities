using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }

        }
        public class CommandValidator : AbstractValidator<command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }
        public class Handler : IRequestHandler<command,Result<Unit>>
        {
            public readonly DataContext _dataContext;
            public readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _dataContext = dataContext;
                _mapper = mapper;
            }

            public DataContext Context { get; }

            public async Task<Result<Unit>> Handle(command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);
                // activity.Title = request.Activity.Title ?? activity.Title;
                if(activity== null) return null;

                _mapper.Map(request.Activity, activity);

                var result =await _dataContext.SaveChangesAsync()>0;
                if(!result) return Result<Unit>.Failure("Could Not Edit");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}
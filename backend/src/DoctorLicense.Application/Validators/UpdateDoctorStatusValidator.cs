using DoctorLicense.Application.DTOs;
using DoctorLicense.Domain.Enums;
using FluentValidation;

namespace DoctorLicense.Application.Validators;

public class UpdateDoctorStatusValidator : AbstractValidator<UpdateDoctorStatusDto>
{
    public UpdateDoctorStatusValidator()
    {
        RuleFor(x => x.Status)
            .Must(s => s == DoctorStatus.Active || s == DoctorStatus.Suspended)
                .WithMessage("Status must be Active or Suspended.");
    }
}

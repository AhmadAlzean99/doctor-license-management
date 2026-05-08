using DoctorLicense.Application.DTOs;
using FluentValidation;

namespace DoctorLicense.Application.Validators;

public class UpdateDoctorValidator : AbstractValidator<UpdateDoctorDto>
{
    public UpdateDoctorValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full name is required.")
            .MaximumLength(150).WithMessage("Full name cannot exceed 150 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.")
            .MaximumLength(150).WithMessage("Email cannot exceed 150 characters.");

        RuleFor(x => x.Specialization)
            .NotEmpty().WithMessage("Specialization is required.")
            .MaximumLength(100).WithMessage("Specialization cannot exceed 100 characters.");

        RuleFor(x => x.LicenseNumber)
            .NotEmpty().WithMessage("License number is required.")
            .MaximumLength(50).WithMessage("License number cannot exceed 50 characters.");

        RuleFor(x => x.LicenseExpiryDate)
            .NotEmpty().WithMessage("License expiry date is required.");
    }
}

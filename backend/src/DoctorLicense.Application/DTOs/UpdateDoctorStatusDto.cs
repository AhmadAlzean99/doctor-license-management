using DoctorLicense.Domain.Enums;

namespace DoctorLicense.Application.DTOs;

public class UpdateDoctorStatusDto
{
    public DoctorStatus Status { get; set; }
}

using DoctorLicense.Domain.Enums;

namespace DoctorLicense.Application.DTOs;

public class GetDoctorsQuery
{
    public string? Search { get; set; }
    public DoctorStatus? Status { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}

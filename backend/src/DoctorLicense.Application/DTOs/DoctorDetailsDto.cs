using DoctorLicense.Domain.Enums;

namespace DoctorLicense.Application.DTOs;

public class DoctorDetailsDto
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;

    public DateOnly LicenseExpiryDate { get; set; }

    public DoctorStatus StoredStatus { get; set; }
    public DoctorStatus EffectiveStatus { get; set; }

    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }
}

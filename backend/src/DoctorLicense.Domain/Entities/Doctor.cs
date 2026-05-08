using DoctorLicense.Domain.Enums;

namespace DoctorLicense.Domain.Entities;

public class Doctor
{
    public int Id { get; set; }

    public required string FullName { get; set; }
    public required string Email { get; set; }
    public required string Specialization { get; set; }
    public required string LicenseNumber { get; set; }

    public DateOnly LicenseExpiryDate { get; set; }

    public DoctorStatus Status { get; set; } = DoctorStatus.Active;

    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }

    public bool IsDeleted { get; set; }
}

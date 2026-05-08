namespace DoctorLicense.Application.DTOs;

public class UpdateDoctorDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string LicenseNumber { get; set; } = string.Empty;

    public DateOnly LicenseExpiryDate { get; set; }
}

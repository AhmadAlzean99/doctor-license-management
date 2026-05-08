using DoctorLicense.Application.DTOs;
using DoctorLicense.Domain.Entities;
using DoctorLicense.Domain.Enums;

namespace DoctorLicense.Application.Interfaces;

public interface IDoctorRepository
{
    Task<PagedResult<DoctorListItemDto>> GetAllAsync(GetDoctorsQuery query, CancellationToken ct);

    Task<Doctor?> GetByIdAsync(int id, CancellationToken ct);

    Task<IReadOnlyList<ExpiredDoctorDto>> GetExpiredAsync(CancellationToken ct);

    Task<int> CreateAsync(Doctor doctor, CancellationToken ct);

    Task UpdateAsync(Doctor doctor, CancellationToken ct);

    Task UpdateStatusAsync(int id, DoctorStatus status, CancellationToken ct);

    Task SoftDeleteAsync(int id, CancellationToken ct);

    Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeId, CancellationToken ct);
}

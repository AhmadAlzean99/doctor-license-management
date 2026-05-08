using DoctorLicense.Application.DTOs;
using DoctorLicense.Application.Interfaces;
using DoctorLicense.Domain.Entities;
using DoctorLicense.Domain.Enums;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DoctorLicense.Infrastructure.Persistence;

public class DoctorRepository : IDoctorRepository
{
    private readonly AppDbContext _db;

    public DoctorRepository(AppDbContext db) => _db = db;

    public async Task<PagedResult<DoctorListItemDto>> GetAllAsync(GetDoctorsQuery query, CancellationToken ct)
    {
        var parameters = new[]
        {
            new SqlParameter("@Search",       (object?)query.Search ?? DBNull.Value),
            new SqlParameter("@StatusFilter", query.Status.HasValue ? (object)(byte)query.Status.Value : DBNull.Value),
            new SqlParameter("@PageNumber",   query.PageNumber),
            new SqlParameter("@PageSize",     query.PageSize)
        };

        var rows = await _db.Database
            .SqlQueryRaw<DoctorListItemDto>(
                "EXEC dbo.sp_GetDoctors @Search, @StatusFilter, @PageNumber, @PageSize",
                parameters)
            .ToListAsync(ct);

        var total = rows.FirstOrDefault()?.TotalCount ?? 0;

        return new PagedResult<DoctorListItemDto>
        {
            Items = rows,
            TotalCount = total,
            PageNumber = query.PageNumber,
            PageSize = query.PageSize
        };
    }

    public Task<Doctor?> GetByIdAsync(int id, CancellationToken ct)
        => _db.Doctors.FirstOrDefaultAsync(d => d.Id == id, ct);

    public async Task<IReadOnlyList<ExpiredDoctorDto>> GetExpiredAsync(CancellationToken ct)
    {
        var rows = await _db.Database
            .SqlQueryRaw<ExpiredDoctorDto>("EXEC dbo.sp_GetExpiredDoctors")
            .ToListAsync(ct);

        return rows;
    }

    public async Task<int> CreateAsync(Doctor doctor, CancellationToken ct)
    {
        _db.Doctors.Add(doctor);
        await _db.SaveChangesAsync(ct);
        return doctor.Id;
    }

    public async Task UpdateAsync(Doctor doctor, CancellationToken ct)
    {
        _db.Doctors.Update(doctor);
        await _db.SaveChangesAsync(ct);
    }

    public async Task UpdateStatusAsync(int id, DoctorStatus status, CancellationToken ct)
    {
        await _db.Doctors
            .Where(d => d.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(d => d.Status, status)
                .SetProperty(d => d.ModifiedDate, DateTime.UtcNow), ct);
    }

    public async Task SoftDeleteAsync(int id, CancellationToken ct)
    {
        await _db.Doctors
            .Where(d => d.Id == id)
            .ExecuteUpdateAsync(s => s
                .SetProperty(d => d.IsDeleted, true)
                .SetProperty(d => d.ModifiedDate, DateTime.UtcNow), ct);
    }

    public Task<bool> LicenseNumberExistsAsync(string licenseNumber, int? excludeId, CancellationToken ct)
    {
        var query = _db.Doctors.Where(d => d.LicenseNumber == licenseNumber);

        if (excludeId.HasValue)
            query = query.Where(d => d.Id != excludeId.Value);

        return query.AnyAsync(ct);
    }
}

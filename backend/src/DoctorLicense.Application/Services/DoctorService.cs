using DoctorLicense.Application.DTOs;
using DoctorLicense.Application.Interfaces;
using DoctorLicense.Domain.Entities;
using DoctorLicense.Domain.Enums;
using DoctorLicense.Domain.Exceptions;
using FluentValidation;

namespace DoctorLicense.Application.Services;

public class DoctorService
{
    private readonly IDoctorRepository _repository;
    private readonly IValidator<CreateDoctorDto> _createValidator;
    private readonly IValidator<UpdateDoctorDto> _updateValidator;
    private readonly IValidator<UpdateDoctorStatusDto> _statusValidator;

    public DoctorService(
        IDoctorRepository repository,
        IValidator<CreateDoctorDto> createValidator,
        IValidator<UpdateDoctorDto> updateValidator,
        IValidator<UpdateDoctorStatusDto> statusValidator)
    {
        _repository = repository;
        _createValidator = createValidator;
        _updateValidator = updateValidator;
        _statusValidator = statusValidator;
    }

    public Task<PagedResult<DoctorListItemDto>> GetAllAsync(GetDoctorsQuery query, CancellationToken ct = default)
        => _repository.GetAllAsync(query, ct);

    public async Task<DoctorDetailsDto> GetByIdAsync(int id, CancellationToken ct = default)
    {
        var doctor = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Doctor with id {id} was not found.");

        return MapToDetails(doctor);
    }

    public Task<IReadOnlyList<ExpiredDoctorDto>> GetExpiredAsync(CancellationToken ct = default)
        => _repository.GetExpiredAsync(ct);

    public async Task<DoctorDetailsDto> CreateAsync(CreateDoctorDto dto, CancellationToken ct = default)
    {
        await _createValidator.ValidateAndThrowAsync(dto, ct);

        if (await _repository.LicenseNumberExistsAsync(dto.LicenseNumber, null, ct))
            throw new ConflictException($"License number '{dto.LicenseNumber}' is already in use.");

        var doctor = new Doctor
        {
            FullName = dto.FullName.Trim(),
            Email = dto.Email.Trim(),
            Specialization = dto.Specialization.Trim(),
            LicenseNumber = dto.LicenseNumber.Trim(),
            LicenseExpiryDate = dto.LicenseExpiryDate,
            Status = dto.Status,
            CreatedDate = DateTime.UtcNow
        };

        doctor.Id = await _repository.CreateAsync(doctor, ct);

        return MapToDetails(doctor);
    }

    public async Task<DoctorDetailsDto> UpdateAsync(int id, UpdateDoctorDto dto, CancellationToken ct = default)
    {
        await _updateValidator.ValidateAndThrowAsync(dto, ct);

        var existing = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Doctor with id {id} was not found.");

        if (await _repository.LicenseNumberExistsAsync(dto.LicenseNumber, id, ct))
            throw new ConflictException($"License number '{dto.LicenseNumber}' is already in use.");

        existing.FullName = dto.FullName.Trim();
        existing.Email = dto.Email.Trim();
        existing.Specialization = dto.Specialization.Trim();
        existing.LicenseNumber = dto.LicenseNumber.Trim();
        existing.LicenseExpiryDate = dto.LicenseExpiryDate;
        existing.ModifiedDate = DateTime.UtcNow;

        await _repository.UpdateAsync(existing, ct);

        return MapToDetails(existing);
    }

    public async Task UpdateStatusAsync(int id, UpdateDoctorStatusDto dto, CancellationToken ct = default)
    {
        await _statusValidator.ValidateAndThrowAsync(dto, ct);

        var existing = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Doctor with id {id} was not found.");

        await _repository.UpdateStatusAsync(id, dto.Status, ct);
    }

    public async Task DeleteAsync(int id, CancellationToken ct = default)
    {
        var existing = await _repository.GetByIdAsync(id, ct)
            ?? throw new NotFoundException($"Doctor with id {id} was not found.");

        await _repository.SoftDeleteAsync(id, ct);
    }

    private static DoctorDetailsDto MapToDetails(Doctor d)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var effective = d.Status == DoctorStatus.Suspended
            ? DoctorStatus.Suspended
            : d.LicenseExpiryDate < today
                ? DoctorStatus.Expired
                : DoctorStatus.Active;

        return new DoctorDetailsDto
        {
            Id = d.Id,
            FullName = d.FullName,
            Email = d.Email,
            Specialization = d.Specialization,
            LicenseNumber = d.LicenseNumber,
            LicenseExpiryDate = d.LicenseExpiryDate,
            StoredStatus = d.Status,
            EffectiveStatus = effective,
            CreatedDate = d.CreatedDate,
            ModifiedDate = d.ModifiedDate
        };
    }
}

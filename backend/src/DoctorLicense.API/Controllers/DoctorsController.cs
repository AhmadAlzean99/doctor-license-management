using DoctorLicense.Application.DTOs;
using DoctorLicense.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace DoctorLicense.API.Controllers;

[ApiController]
[Route("api/doctors")]
public class DoctorsController : ControllerBase
{
    private readonly DoctorService _service;

    public DoctorsController(DoctorService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<PagedResult<DoctorListItemDto>>> GetAll(
        [FromQuery] GetDoctorsQuery query, CancellationToken ct)
    {
        var result = await _service.GetAllAsync(query, ct);
        return Ok(result);
    }

    [HttpGet("expired")]
    public async Task<ActionResult<IReadOnlyList<ExpiredDoctorDto>>> GetExpired(CancellationToken ct)
    {
        var result = await _service.GetExpiredAsync(ct);
        return Ok(result);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<DoctorDetailsDto>> GetById(int id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return Ok(result);
    }

    [HttpPost]
    public async Task<ActionResult<DoctorDetailsDto>> Create(
        [FromBody] CreateDoctorDto dto, CancellationToken ct)
    {
        var result = await _service.CreateAsync(dto, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<DoctorDetailsDto>> Update(
        int id, [FromBody] UpdateDoctorDto dto, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, dto, ct);
        return Ok(result);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id, [FromBody] UpdateDoctorStatusDto dto, CancellationToken ct)
    {
        await _service.UpdateStatusAsync(id, dto, ct);
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct)
    {
        await _service.DeleteAsync(id, ct);
        return NoContent();
    }
}

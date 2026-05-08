-- =============================================================
-- 03_sp_GetExpiredDoctors.sql
--
-- Bonus stored procedure for the assignment.
--
-- Returns every non-deleted doctor whose license has already
-- expired (LicenseExpiryDate < today). Useful for compliance
-- dashboards, license-renewal reminder jobs, and the
-- "Expired licenses" section of the admin UI.
--
-- Returns the original Status column (not the computed one)
-- so callers can tell whether a doctor is also Suspended.
-- The result is sorted by oldest expiry first — the most
-- urgent cases bubble to the top.
-- =============================================================


SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO


USE DoctorLicenseDb;
GO


CREATE OR ALTER PROCEDURE dbo.sp_GetExpiredDoctors
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @Today DATE = CAST(SYSUTCDATETIME() AS DATE);

    SELECT
        d.Id,
        d.FullName,
        d.Email,
        d.Specialization,
        d.LicenseNumber,
        d.LicenseExpiryDate,
        d.Status,
        d.CreatedDate,
        d.ModifiedDate,
        DATEDIFF(DAY, d.LicenseExpiryDate, @Today)  AS DaysExpired
    FROM dbo.Doctors AS d
    WHERE d.IsDeleted = 0
      AND d.LicenseExpiryDate < @Today
    ORDER BY d.LicenseExpiryDate ASC;   -- oldest expiry first
END
GO


PRINT 'Stored procedure dbo.sp_GetExpiredDoctors created or altered.';

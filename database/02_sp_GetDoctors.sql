-- =============================================================
-- 02_sp_GetDoctors.sql
--
-- Returns a paginated list of doctors with all fields needed
-- by the frontend table view.
--
-- Features required by the assignment:
--   - Returns doctor list WITH status
--   - Applies expiry logic (Active / Expired) inside the query
--     so the C# layer never has to compute it
--   - Supports search by name or license number
--   - Supports filter by status (Active / Expired / Suspended)
--   - Excludes soft-deleted records
--
-- Bonus features:
--   - Server-side pagination (OFFSET / FETCH)
--   - Returns TotalCount in same result set (one round trip)
--   - Suspended status is preserved even if the license is expired
--     (a suspended doctor stays suspended; the rule does not flip)
-- =============================================================


-- Required for stored procedure creation
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO


USE DoctorLicenseDb;
GO


CREATE OR ALTER PROCEDURE dbo.sp_GetDoctors
    @Search       NVARCHAR(150) = NULL,   -- search by name OR license; NULL/empty = no search
    @StatusFilter TINYINT       = NULL,   -- 1=Active, 2=Expired, 3=Suspended; NULL = all
    @PageNumber   INT           = 1,      -- 1-based page number
    @PageSize     INT           = 10      -- rows per page
AS
BEGIN
    SET NOCOUNT ON;


    -- ---------------------------------------------------------
    -- Defensive parameter handling
    -- ---------------------------------------------------------
    DECLARE @SearchClean NVARCHAR(150) = NULLIF(LTRIM(RTRIM(@Search)), N'');
    DECLARE @Today       DATE          = CAST(SYSUTCDATETIME() AS DATE);

    IF (@PageNumber IS NULL OR @PageNumber < 1) SET @PageNumber = 1;
    IF (@PageSize   IS NULL OR @PageSize   < 1) SET @PageSize   = 10;
    IF (@PageSize > 100)                        SET @PageSize   = 100;  -- safety cap


    -- ---------------------------------------------------------
    -- Step 1 — Read non-deleted rows and compute the effective
    -- Status:
    --   * Suspended (3) stays Suspended regardless of expiry
    --   * Otherwise: Expired (2) if expiry has passed, else Active (1)
    --
    -- Step 2 — Apply optional search and optional status filter
    -- Step 3 — Page and return TotalCount alongside each row
    -- ---------------------------------------------------------
    ;WITH FilteredDoctors AS
    (
        SELECT
            d.Id,
            d.FullName,
            d.Email,
            d.Specialization,
            d.LicenseNumber,
            d.LicenseExpiryDate,
            CAST(
                CASE
                    WHEN d.Status = 3                   THEN 3   -- Suspended
                    WHEN d.LicenseExpiryDate < @Today   THEN 2   -- Expired
                    ELSE                                      1  -- Active
                END
            AS TINYINT)                                 AS Status,
            d.CreatedDate,
            d.ModifiedDate
        FROM dbo.Doctors AS d
        WHERE d.IsDeleted = 0
          AND (
                @SearchClean IS NULL
             OR d.FullName      LIKE N'%' + @SearchClean + N'%'
             OR d.LicenseNumber LIKE N'%' + @SearchClean + N'%'
          )
    )
    SELECT
        Id,
        FullName,
        Email,
        Specialization,
        LicenseNumber,
        LicenseExpiryDate,
        Status,
        CreatedDate,
        ModifiedDate,
        COUNT(*) OVER ()                                AS TotalCount
    FROM FilteredDoctors
    WHERE (@StatusFilter IS NULL OR Status = @StatusFilter)
    ORDER BY CreatedDate DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END
GO


PRINT 'Stored procedure dbo.sp_GetDoctors created or altered.';

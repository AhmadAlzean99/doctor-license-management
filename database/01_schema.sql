-- =============================================================
-- 01_schema.sql
--
-- Creates the DoctorLicenseDb database and the Doctors table
-- for the Doctor License Management module.
--
-- This script is idempotent: it can be re-run safely without
-- dropping data. Each object is created only if it does not
-- already exist.
--
-- Status values (TINYINT, 1 byte each):
--   1 = Active
--   2 = Expired
--   3 = Suspended
-- =============================================================


-- Required for filtered indexes (sqlcmd defaults differ from SSMS)
SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO


-- -------------------------------------------------------------
-- 1. Create the database (if it does not already exist)
-- -------------------------------------------------------------
IF DB_ID('DoctorLicenseDb') IS NULL
BEGIN
    CREATE DATABASE DoctorLicenseDb;
    PRINT 'Database DoctorLicenseDb created.';
END
ELSE
    PRINT 'Database DoctorLicenseDb already exists — skipping creation.';
GO


USE DoctorLicenseDb;
GO


-- -------------------------------------------------------------
-- 2. Create the Doctors table (if it does not already exist)
-- -------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1
      FROM sys.tables
     WHERE name = 'Doctors'
       AND schema_id = SCHEMA_ID('dbo')
)
BEGIN
    CREATE TABLE dbo.Doctors
    (
        Id                  INT IDENTITY(1, 1)  NOT NULL,
        FullName            NVARCHAR(150)       NOT NULL,
        Email               NVARCHAR(150)       NOT NULL,
        Specialization      NVARCHAR(100)       NOT NULL,
        LicenseNumber       NVARCHAR(50)        NOT NULL,
        LicenseExpiryDate   DATE                NOT NULL,
        Status              TINYINT             NOT NULL
            CONSTRAINT DF_Doctors_Status        DEFAULT (1),
        CreatedDate         DATETIME2(0)        NOT NULL
            CONSTRAINT DF_Doctors_CreatedDate   DEFAULT (SYSUTCDATETIME()),
        ModifiedDate        DATETIME2(0)        NULL,
        IsDeleted           BIT                 NOT NULL
            CONSTRAINT DF_Doctors_IsDeleted     DEFAULT (0),

        CONSTRAINT PK_Doctors PRIMARY KEY CLUSTERED (Id),
        CONSTRAINT CK_Doctors_Status CHECK (Status IN (1, 2, 3))
    );

    PRINT 'Table dbo.Doctors created.';
END
ELSE
    PRINT 'Table dbo.Doctors already exists — skipping creation.';
GO


-- -------------------------------------------------------------
-- 3. Unique index on LicenseNumber for active (non-deleted) rows
--
-- Filtered index: enforces uniqueness only where IsDeleted = 0.
-- This allows a license number to be reused if its previous
-- holder was soft-deleted.
-- -------------------------------------------------------------
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
     WHERE name = 'UX_Doctors_LicenseNumber_Active'
       AND object_id = OBJECT_ID('dbo.Doctors')
)
BEGIN
    CREATE UNIQUE INDEX UX_Doctors_LicenseNumber_Active
        ON dbo.Doctors (LicenseNumber)
     WHERE IsDeleted = 0;

    PRINT 'Filtered unique index UX_Doctors_LicenseNumber_Active created.';
END
GO


-- -------------------------------------------------------------
-- 4. Supporting indexes for common query patterns
-- -------------------------------------------------------------

-- Used by status filtering (e.g. show only Active)
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
     WHERE name = 'IX_Doctors_Status_IsDeleted'
       AND object_id = OBJECT_ID('dbo.Doctors')
)
BEGIN
    CREATE INDEX IX_Doctors_Status_IsDeleted
        ON dbo.Doctors (Status, IsDeleted);

    PRINT 'Index IX_Doctors_Status_IsDeleted created.';
END
GO


-- Used by the auto-expiry logic and the expired-doctors SP
IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
     WHERE name = 'IX_Doctors_LicenseExpiryDate'
       AND object_id = OBJECT_ID('dbo.Doctors')
)
BEGIN
    CREATE INDEX IX_Doctors_LicenseExpiryDate
        ON dbo.Doctors (LicenseExpiryDate)
        INCLUDE (FullName, LicenseNumber)
     WHERE IsDeleted = 0;

    PRINT 'Filtered index IX_Doctors_LicenseExpiryDate created.';
END
GO


PRINT '';
PRINT '=============================================================';
PRINT 'Schema setup complete.';
PRINT '=============================================================';

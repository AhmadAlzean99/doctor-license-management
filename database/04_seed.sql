-- =============================================================
-- 04_seed.sql
--
-- Seeds 10 sample doctors covering all status scenarios.
--
-- The seed is idempotent — each row is inserted only if its
-- LicenseNumber does not already exist. Re-running this script
-- will not produce duplicates.
--
-- Coverage when sp_GetDoctors is executed (assuming today is
-- between 2026-05-01 and 2027-01-01):
--   - Active doctors (license still valid)        : ~5
--   - Expired doctors (license date in the past)  : ~3
--   - Suspended doctors (admin override)          : ~2
-- =============================================================


SET QUOTED_IDENTIFIER ON;
SET ANSI_NULLS ON;
GO


USE DoctorLicenseDb;
GO


-- 1 — Active, valid license
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-001')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Sarah Ahmed Al-Mansouri', N'sarah.mansouri@clinic.ae', N'Cardiology',         N'MED-DXB-001', '2027-08-15', 1);


-- 2 — Stored as Active but expiry in past → SP will compute Expired
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-002')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Mohammed Hassan Khalil',  N'm.khalil@clinic.ae',       N'Neurology',          N'MED-DXB-002', '2024-12-31', 1);


-- 3 — Active, valid license
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-003')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Fatima Al-Hashimi',       N'f.hashimi@clinic.ae',      N'Pediatrics',         N'MED-DXB-003', '2028-03-20', 1);


-- 4 — Stored as Active but expiry in past → SP will compute Expired
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-004')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'James O''Connor',         N'j.oconnor@clinic.ae',      N'Orthopedics',        N'MED-DXB-004', '2025-09-10', 1);


-- 5 — Suspended (admin override; expiry still future)
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-005')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Priya Sharma',            N'p.sharma@clinic.ae',       N'Dermatology',        N'MED-DXB-005', '2027-11-05', 3);


-- 6 — Active, valid license
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-006')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Omar Farouq',             N'o.farouq@clinic.ae',       N'General Surgery',    N'MED-DXB-006', '2029-01-15', 1);


-- 7 — Stored as Active but expiry in past → SP will compute Expired
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-007')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Aisha Mahmoud',           N'a.mahmoud@clinic.ae',      N'Obstetrics',         N'MED-DXB-007', '2026-02-28', 1);


-- 8 — Active, valid license (long expiry)
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-008')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Liu Wei Chen',            N'l.chen@clinic.ae',         N'Radiology',          N'MED-DXB-008', '2030-06-30', 1);


-- 9 — Suspended AND expired (Suspended wins per SP logic)
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-009')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Hassan Al-Zaabi',         N'h.zaabi@clinic.ae',        N'Psychiatry',         N'MED-DXB-009', '2025-04-12', 3);


-- 10 — Active, valid license
IF NOT EXISTS (SELECT 1 FROM dbo.Doctors WHERE LicenseNumber = N'MED-DXB-010')
INSERT INTO dbo.Doctors (FullName, Email, Specialization, LicenseNumber, LicenseExpiryDate, Status)
VALUES (N'Maria Rodriguez',         N'm.rodriguez@clinic.ae',    N'Emergency Medicine', N'MED-DXB-010', '2028-09-22', 1);


GO


PRINT '';
PRINT '=============================================================';
PRINT 'Seed complete. Row count:';
SELECT COUNT(*) AS DoctorsTotal FROM dbo.Doctors;
PRINT '=============================================================';

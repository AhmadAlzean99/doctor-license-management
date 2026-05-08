using DoctorLicense.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace DoctorLicense.Infrastructure.Persistence.Configurations;

public class DoctorConfiguration : IEntityTypeConfiguration<Doctor>
{
    public void Configure(EntityTypeBuilder<Doctor> builder)
    {
        builder.ToTable("Doctors", "dbo");

        builder.HasKey(d => d.Id);

        builder.Property(d => d.Id)
            .ValueGeneratedOnAdd();

        builder.Property(d => d.FullName)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(d => d.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(d => d.Specialization)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(d => d.LicenseNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.Property(d => d.LicenseExpiryDate)
            .HasColumnType("date");

        builder.Property(d => d.Status)
            .HasColumnType("tinyint")
            .HasConversion<byte>();

        builder.Property(d => d.CreatedDate)
            .HasColumnType("datetime2(0)");

        builder.Property(d => d.ModifiedDate)
            .HasColumnType("datetime2(0)");

        builder.Property(d => d.IsDeleted)
            .HasDefaultValue(false);

        builder.HasIndex(d => d.LicenseNumber)
            .IsUnique()
            .HasFilter("[IsDeleted] = 0")
            .HasDatabaseName("UX_Doctors_LicenseNumber_Active");

        builder.HasQueryFilter(d => !d.IsDeleted);
    }
}

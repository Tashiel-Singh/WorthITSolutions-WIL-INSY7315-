# File storage
The design specified Azure Blob Storage for invoice PDFs. Render's free tier has an ephemeral filesystem, so generated PDFs must not be stored on the web service disk.
Planned replacement: an S3-compatible or hosted bucket (for example Supabase Storage) with a private "invoices" bucket and credentials supplied through environment variables.
Status: not integrated in this submission. Invoices are generated on demand from database records.
